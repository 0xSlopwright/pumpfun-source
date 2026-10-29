use anchor_lang::solana_program::entrypoint;
#[global_allocator]
static ALLOCATOR: entrypoint::BumpAllocator = entrypoint::BumpAllocator {start:entrypoint::HEAP_START_ADDRESS as usize,len:entrypoint::HEAP_LENGTH};

pub fn original_shape(start: usize, end: usize, count: usize, sell: bool) -> Vec<u8> {
    (start..end).map(|j| {
        let protocol = if sell { j + 1 == count } else { j == 0 };
        let creator = if sell { j == 0 } else { j + 1 == count };
        (protocol as u8) | ((creator as u8) << 1)
    }).collect()
}
pub fn match_shape(start: usize, end: usize, count: usize, sell: bool) -> Vec<u8> {
    (start..end).map(|j| match sell {
        true => ((j + 1 == count) as u8) | (((j == 0) as u8) << 1),
        false => ((j == 0) as u8) | (((j + 1 == count) as u8) << 1),
    }).collect()
}
pub fn shared_shape(start: usize, end: usize, count: usize, sell: bool) -> Vec<u8> {
    (start..end).map(|j| {
        let first = j == 0;
        let last = j + 1 == count;
        let protocol = if sell { last } else { first };
        let creator = if sell { first } else { last };
        u8::from(protocol) | (u8::from(creator) << 1)
    }).collect()
}
pub fn moved_shape(start: usize, end: usize, count: usize, sell: bool) -> Vec<u8> {
    (start..end).map(move |j| {
        let protocol = if sell { j + 1 == count } else { j == 0 };
        let creator = if sell { j == 0 } else { j + 1 == count };
        (protocol as u8) | ((creator as u8) << 1)
    }).collect()
}

pub fn tuple_shape((sell, count, range): (&bool, &usize, std::ops::Range<usize>)) -> Vec<u8> {
    range.map(|j| {
        let protocol = if *sell { j + 1 == *count } else { j == 0 };
        let creator = if *sell { j == 0 } else { j + 1 == *count };
        (protocol as u8) | ((creator as u8) << 1)
    }).collect()
}
pub fn tuple_moved((sell, count, range): (&bool, &usize, std::ops::Range<usize>)) -> Vec<u8> {
    range.map(move |j| {
        let protocol = if *sell { j + 1 == *count } else { j == 0 };
        let creator = if *sell { j == 0 } else { j + 1 == *count };
        (protocol as u8) | ((creator as u8) << 1)
    }).collect()
}
pub fn tuple_shared((sell, count, range): (&bool, &usize, std::ops::Range<usize>)) -> Vec<u8> {
    range.map(|j| {
        let first = j == 0;
        let last = j + 1 == *count;
        let protocol = if *sell { last } else { first };
        let creator = if *sell { first } else { last };
        (protocol as u8) | ((creator as u8) << 1)
    }).collect()
}
pub fn tuple_shared_lastfirst((sell, count, range): (&bool, &usize, std::ops::Range<usize>)) -> Vec<u8> {
    range.map(|j| {
        let last = j + 1 == *count;
        let first = j == 0;
        let protocol = if *sell { last } else { first };
        let creator = if *sell { first } else { last };
        (protocol as u8) | ((creator as u8) << 1)
    }).collect()
}
pub fn tuple_buy((sell, count, range): (&bool, &usize, std::ops::Range<usize>)) -> Vec<u8> {
    range.map(|j| {
        let first = j == 0;
        let last = j + 1 == *count;
        let protocol = if *sell { first } else { last };
        let creator = if *sell { last } else { first };
        (protocol as u8) | ((creator as u8) << 1)
    }).collect()
}
