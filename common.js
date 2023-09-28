// common.js

// RangeとNumberのInputを関連付けし、コールバックを登録
function setupRangeAndNumberInput(rangeInputID, numberInputID, parse, onInput = null) {
    // HTMLElementの取得
    const rangeInput = document.getElementById(rangeInputID);
    const numberInput = document.getElementById(numberInputID);
    if (!rangeInput || !numberInput) {
        console.warn(`Invalid element id range:${rangeInputID} number:${numberInputID}`);
        return;
    }

    // Rangeの値を基準に値を統一
    numberInput.value = rangeInput.value;

    // Range変更イベントからテキストボックスへ入力反映
    rangeInput.addEventListener("input", function() {
        numberInput.value = rangeInput.value;
        onInput?.();
    });

    // テキストボックス変更イベントからRangeへ入力反映
    numberInput.addEventListener("input", function() {
        const value = parse(numberInput.value);
        if (!isNaN(value) && value >= parse(rangeInput.min) && value <= parse(rangeInput.max)) {
            rangeInput.value = value;
            onInput?.();
        }
    });
}

// イベント登録
function addEventListener(id, event, onEvent) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Invalid element id: ${id}`);
        return;
    }
    element.addEventListener([event], onEvent);
}

export { setupRangeAndNumberInput, addEventListener }