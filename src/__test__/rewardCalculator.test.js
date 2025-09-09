import {rewardCalculator} from '../utils/rewardCalculator';
// provide three positive and three negative test cases

test("calculates rewards correctly for amount 120", () =>{
    expect(rewardCalculator(120)).toBe(90);
})

test("calculates rewards correctly for amount 150", () =>{
    expect(rewardCalculator(150)).toBe(120);
})

test("calculates rewards correctly for amount 200", () =>{
    expect(rewardCalculator(200)).toBe(250);
})

test("returns 0 rewards for amount 50", () =>{
    expect(rewardCalculator(50)).toBe(0);
})

test("returns 0 rewards for amount 0", () =>{
    expect(rewardCalculator(0)).toBe(0);
})

test("handles fractional amounts correctly", ()=>{
    expect(rewardCalculator(120.5)).toBe(91)
})

test("handle negative amounts", () =>{
    expect(rewardCalculator(-100)).toBe(0);
})

