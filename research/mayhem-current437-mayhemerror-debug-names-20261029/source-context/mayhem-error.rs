#[error_code]
pub enum MayhemError {
    #[msg("Trading is paused")]
    TradingPaused = 0,
    #[msg("Trading is active")]
    TradingActive = 1,
    #[msg("Math overflow")]
    MathOverflow = 2,
    #[msg("Too little sol reserves")]
    SolReservesTooLow = 3,
    #[msg("Mayhem mode ended")]
    MayhemModeEnded = 4,
    #[msg("Mayhem mode not ended")]
    MayhemModeNotEnded = 5,
    #[msg("Overall risk tolerance exceeded")]
    OverallRiskExceeded = 6,
    #[msg("Per coin risk tolerance exceeded")]
    CoinRiskExceeded = 7,
    #[msg("Pump CPI call failed")]
    PumpCpiFailed = 8,
    #[msg("Math Overflow in Pump CPI call")]
    PumpCpiMathOverflow = 9,
    #[msg("Pump Swap CPI call failed")]
    PumpSwapCpiFailed = 10,
    #[msg("Math Overflow in Pump Swap CPI call")]
    PumpSwapCpiMathOverflow = 11,
    #[msg("Price impact exceeds slippage tolerance in Pump CPI call")]
    PumpCpiSlippage = 12,
    #[msg("Price impact exceeds slippage tolerance in Pump Swap CPI call")]
    PumpSwapCpiSlippage = 13,
    #[msg("Withdraw Rate limit")]
    WithdrawRateLimit = 14,
    #[msg("Trade Rate limit")]
    TradeRateLimit = 15,
    #[msg("Account type not supported")]
    AccountTypeNotSupported = 16,
    #[msg("Only 8 fee recipients supported")]
    MaxFeeRecipientsExceeded = 17,
    #[msg("Invalid bump provided")]
    InvalidBump = 18,
    #[msg("Sweep fee Rate limit")]
    SweepFeeRateLimit = 19,
}
