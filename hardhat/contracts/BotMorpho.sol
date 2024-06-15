// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/* IMPORTS */

import {MathLib, WAD} from "./libraries/MathLib.sol";
import {IMorphoLiquidateCallback} from "./interfaces/IMorphoCallbacks.sol";

import {Id, IMorpho, MarketParams} from "./interfaces/IMorpho.sol";
import {SafeTransferLib, ERC20} from "./libraries/SafeTransferLibSolmate.sol";
import {MorphoLib} from "./libraries/periphery/MorphoLib.sol";
import {MarketParamsLib} from "./libraries/MarketParamsLib.sol";

struct MorphoLiquidateData {
    address collateralToken;
    address loanToken;
    uint256 seized;
    address pair;
    bytes swapData;
}

interface ISwap {
    /// @notice Swaps collateral token to loan token.
    /// @param amount The amount of collateral token to swap.
    /// @return returnedAmount The amount of loan token returned.
    function swapCollatToLoan(
        uint256 amount
    ) external returns (uint256 returnedAmount);
}

/* CONTRACT */

contract BotMorpho is IMorphoLiquidateCallback {
    using MorphoLib for IMorpho;
    using MarketParamsLib for MarketParams;
    using SafeTransferLib for ERC20;

    using MathLib for uint128;
    using MathLib for uint256;

    IMorpho public constant morpho =
        IMorpho(0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb);
    ISwap public constant swapper =
        ISwap(0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb); // JUST FOR TESTING

    /// @dev The maximum fee a market can have (25%).
    uint256 constant MAX_FEE = 0.25e18;

    /// @dev Oracle price scale.
    uint256 constant ORACLE_PRICE_SCALE = 1e36;

    /// @dev Liquidation cursor.
    uint256 constant LIQUIDATION_CURSOR = 0.3e18;

    /// @dev Max liquidation incentive factor.
    uint256 constant MAX_LIQUIDATION_INCENTIVE_FACTOR = 1.15e18;

    constructor() {}

    modifier onlyMorpho() {
        require(
            msg.sender == address(morpho),
            "msg.sender should be Morpho Blue"
        );
        _;
    }

    /// Type of liquidation callback data.
    struct LiquidateData {
        address collateralToken;
    }

    function morphoLiquidate(
        Id id,
        address borrower,
        uint256 seizedAssets,
        address pair,
        bytes calldata swapData
    ) external payable {
        MarketParams memory params = morpho.idToMarketParams(id);
        morpho.liquidate(
            params,
            borrower,
            seizedAssets,
            0,
            abi.encode(
                MorphoLiquidateData(
                    params.collateralToken,
                    params.loanToken,
                    seizedAssets,
                    pair,
                    swapData
                )
            )
        );
    }

    function onMorphoLiquidate(
        uint256,
        bytes calldata data
    ) external onlyMorpho {
        LiquidateData memory decoded = abi.decode(data, (LiquidateData));

        // ERC20(decoded.collateralToken).approve(
        //     address(swapper),
        //     type(uint256).max
        // );

        // swapper.swapCollatToLoan(
        //     ERC20(decoded.collateralToken).balanceOf(address(this))
        // );
    }

    function getLiquidationIncentiveFactor(
        uint256 lltv
    ) public pure returns (uint256) {
        uint256 liquidationIncentiveFactor = min(
            MAX_LIQUIDATION_INCENTIVE_FACTOR,
            WAD.wDivDown(WAD - LIQUIDATION_CURSOR.wMulDown(WAD - lltv))
        );
        return liquidationIncentiveFactor;
    }

    function min(uint256 x, uint256 y) internal pure returns (uint256 z) {
        assembly {
            z := xor(x, mul(xor(x, y), lt(y, x)))
        }
    }

    /// @notice Fully liquidates the borrow position of `borrower` on the given `marketParams` market of Morpho Blue and
    /// sends the profit of the liquidation to the sender.
    /// @dev Thanks to callbacks, the sender doesn't need to hold any tokens to perform this operation.
    /// @param marketParams The market to perform the liquidation on.
    /// @param borrower The owner of the liquidable borrow position.
    /// @param seizeFullCollat Pass `True` to seize all the collateral of `borrower`. Pass `False` to repay all of the
    /// `borrower`'s debt.
    function fullLiquidationWithoutCollat(
        MarketParams calldata marketParams,
        address borrower,
        bool seizeFullCollat
    ) public returns (uint256 seizedAssets, uint256 repaidAssets) {
        Id id = marketParams.id();

        uint256 seizedCollateral;
        uint256 repaidShares;

        if (seizeFullCollat) seizedCollateral = morpho.collateral(id, borrower);
        else repaidShares = morpho.borrowShares(id, borrower);

        _approveMaxTo(marketParams.loanToken, address(morpho));

        (seizedAssets, repaidAssets) = morpho.liquidate(
            marketParams,
            borrower,
            seizedCollateral,
            repaidShares,
            abi.encode(LiquidateData(marketParams.collateralToken))
        );

        ERC20(marketParams.loanToken).safeTransfer(
            msg.sender,
            ERC20(marketParams.loanToken).balanceOf(address(this))
        );
    }

    function _approveMaxTo(address asset, address spender) internal {
        if (ERC20(asset).allowance(address(this), spender) == 0) {
            ERC20(asset).safeApprove(spender, type(uint256).max);
        }
    }
}
