use crate::*;

#[account]
#[derive(Debug)]
pub struct GlobalVolumeAccumulator {
    pub start_time:i64,
    pub end_time:i64,
    pub seconds_in_a_day:i64,
    pub mint:Pubkey,
    pub total_token_supply:[u64;30],
    pub sol_volumes:[u64;30],
}
#[account]
pub struct UserVolumeAccumulator {
    pub user: Pubkey,
    pub needs_claim: bool,
    pub total_unclaimed_tokens: u64,
    pub total_claimed_tokens: u64,
    pub current_sol_volume: u64,
    pub last_update_timestamp: i64,
    pub has_total_claimed_tokens: bool,
    pub cashback_earned: u64,
    pub total_cashback_claimed: u64,
}

impl GlobalVolumeAccumulator {
    pub fn update_token_incentives(
        &mut self,
        start_time:i64,
        end_time:i64,
        seconds_in_a_day:i64,
        mint:&Pubkey,
        day_number:u64,
        token_supply_per_day:u64,
        current_timestamp:i64,
    )->Result<()> {
        self.seconds_in_a_day=seconds_in_a_day;
        self.mint=*mint;
        if start_time!=0 && end_time!=0 {
            if start_time!=self.start_time {
                require_gt!(start_time,current_timestamp,PumpAmmError::StartTimeInThePast);
                self.start_time=start_time;
                self.total_token_supply=[0;30];
                self.sol_volumes=[0;30];
            }
            require_gt!(end_time,current_timestamp,PumpAmmError::EndTimeInThePast);
            require_gt!(end_time,start_time,PumpAmmError::EndTimeBeforeStartTime);
            require_gte!(seconds_in_a_day.checked_mul(30).expect("Unexpected overflow")-1,end_time-start_time,PumpAmmError::TimeRangeTooLarge);
            self.end_time=end_time;
            if current_timestamp>self.start_time {
                let current=usize::try_from(current_timestamp).expect("SVM is 64-bit")
                    .checked_sub(usize::try_from(self.start_time).expect("SVM is 64-bit"))
                    .and_then(|value| value.checked_div(usize::try_from(self.seconds_in_a_day).expect("SVM is 64-bit")))
                    .expect("current_timestamp should be bigger than start_time");
                let end=self.end_day();
                require_gt!(end,current,PumpAmmError::EndTimeBeforeCurrentDay);
                for i in current+1..=end {self.sol_volumes[i]=0;}
            }
        }
        if token_supply_per_day>0 {
            if current_timestamp>=self.start_time {
                require!(current_timestamp<=self.end_time,PumpAmmError::SupplyUpdateForFinishedRange);
            }
            let current=if current_timestamp<self.start_time {0}else{
                usize::try_from(current_timestamp).expect("SVM is 64-bit")
                    .checked_sub(usize::try_from(self.start_time).expect("SVM is 64-bit"))
                    .and_then(|value| value.checked_div(usize::try_from(self.seconds_in_a_day).expect("SVM is 64-bit")))
                    .expect("current_timestamp should be bigger than start_time")
            };
            let end=self.end_day();
            if day_number<30 {
                require_gte!(end,day_number as usize,PumpAmmError::DayIndexAfterEndIndex);
                require_gte!(day_number as usize,current,PumpAmmError::DayInActiveRange);
                self.total_token_supply[day_number as usize]=token_supply_per_day;
            }else{for i in current..=end {self.total_token_supply[i]=token_supply_per_day;}}
        }
        Ok(())
    }

    pub fn end_day(&self)->usize {
        usize::try_from(self.end_time).expect("SVM is 64-bit")
            .checked_sub(usize::try_from(self.start_time).expect("SVM is 64-bit"))
            .and_then(|value| value.checked_div(usize::try_from(self.seconds_in_a_day).expect("SVM is 64-bit")))
            .expect("end_time should be bigger than start_time")
    }
}
