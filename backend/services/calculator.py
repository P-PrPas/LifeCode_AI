from typing import Dict, List, Tuple

def calculate_gift_number(dob: str) -> int:
    # dob is 'YYYY-MM-DD'
    digits = [int(char) for char in dob if char.isdigit()]
    return sum(digits)

def calculate_life_code(gift_number: int) -> int:
    current_sum = gift_number
    while current_sum > 9:
        current_sum = sum(int(digit) for digit in str(current_sum))
    return current_sum

def get_weights(dob: str, gift_number: int, life_code: int) -> Dict[int, int]:
    # 1pt for each DOB digit (Circle)
    # 3pts for each Gift Number digit (Triangle)
    # 5pts for each Life Code digit (Square)
    weights = {i: 0 for i in range(10)}
    
    for char in dob:
        if char.isdigit():
            weights[int(char)] += 1
            
    for char in str(gift_number):
        weights[int(char)] += 3
        
    for char in str(life_code):
        weights[int(char)] += 5
        
    return weights

def get_shapes(dob: str, gift_number: int, life_code: int) -> Dict[int, Dict[str, int]]:
    shapes = {i: {"circles": 0, "triangles": 0, "squares": 0} for i in range(10)}
    
    for char in dob:
        if char.isdigit():
            shapes[int(char)]["circles"] += 1
            
    for char in str(gift_number):
        shapes[int(char)]["triangles"] += 1
        
    for char in str(life_code):
        shapes[int(char)]["squares"] += 1
        
    return shapes

def detect_combos(weights: Dict[int, int]) -> List[str]:
    combos = []
    active_numbers = [num for num, w in weights.items() if w > 0]
    
    # Defined Combos
    if all(x in active_numbers for x in [1, 2, 3]): combos.append("1-2-3")
    if all(x in active_numbers for x in [4, 5, 6]): combos.append("4-5-6")
    if all(x in active_numbers for x in [7, 8, 9]): combos.append("7-8-9")
    if all(x in active_numbers for x in [1, 5, 9]): combos.append("1-5-9")
    if all(x in active_numbers for x in [3, 5, 7]): combos.append("3-5-7")
    if all(x in active_numbers for x in [2, 4]): combos.append("2-4")
    if all(x in active_numbers for x in [2, 6]): combos.append("2-6")
    if all(x in active_numbers for x in [4, 8]): combos.append("4-8")
    if all(x in active_numbers for x in [6, 8]): combos.append("6-8")
    
    return combos

def process_dob(dob: str) -> dict:
    digits = [int(char) for char in dob if char.isdigit()]
    gift_number = calculate_gift_number(dob)
    life_code = calculate_life_code(gift_number)
    weights = get_weights(dob, gift_number, life_code)
    shapes = get_shapes(dob, gift_number, life_code)
    combos = detect_combos(weights)
    
    return {
        "dob_digits": digits,
        "gift_number": gift_number,
        "life_code": life_code,
        "weights": weights,
        "shapes": shapes,
        "combo_lines": combos
    }
