// effects.js

import * as common from "./common.js";

// 1パラメータエフェクトの親クラス
class SingleParameterEffectBase {
    constructor(onChange, effectID, scaleEffect = null) {
        this._enableCheckboxID = effectID + "Checkbox";
        this._valueRangeID = effectID + "Range";
        this._valueNumberID = effectID + "Number";
        this._defaultValue = this.getValue();
        this._scaleEffect = scaleEffect;
        // Checkboxイベント登録
        common.addEventListener(this._enableCheckboxID, "input", onChange);
        // リセットボタンイベント登録
        common.addEventListener(effectID + "ResetButton", "click", () => { this.resetValue(); onChange(); });
        // RangeとNumberのイベント登録
        common.setupRangeAndNumberInput(this._valueRangeID, this._valueNumberID, this._getParser(), () => { this._setCheckbox(true); onChange(); });
    }

    // フィルター文字列取得
    getFilter() {
        if (this.getCheckboxChecked()) {
            const filterFormat = this._getFilterFormat();
            const scale = (this._scaleEffect?.getCheckboxChecked() ?? false) ? this._scaleEffect.getValue() : 1;
            return filterFormat.replace("[value]", this.getValue() * scale);
        }
        else {
            return "";
        }
    }

    // チェックボックス取得
    getCheckboxChecked() {
        const checkbox = document.getElementById(this._enableCheckboxID);
        return checkbox && checkbox.checked; 
    }

    // チェックボックス設定
    _setCheckbox(isChecked) {
        document.getElementById(this._enableCheckboxID).checked = isChecked;
    }
    
    // 値初期化
    resetValue() {
        this._setCheckbox(false);
        this._setValue(this._defaultValue);
    }

    // 値取得
    getValue() {
        return this._getParser()(document.getElementById(this._valueRangeID).value);
    }

    // 値設定
    _setValue(value) {
        document.getElementById(this._valueRangeID).value = value;
        document.getElementById(this._valueNumberID).value = value;
    }

    // フィルター文字列取得
    _getFilterFormat() {
        return "";
    }

    // RangeからNumber入力へのParser取得
    _getParser() {
        return parseInt;
    }
}

// 1パラメータのFloatを扱うエフェクトの親クラス
class SingleFloatParameterEffectBase extends SingleParameterEffectBase {
    // RangeからNumber入力へのParser取得
    _getParser() { return parseFloat; }
}

// スケールエフェクト
export class ScaleEffect extends SingleFloatParameterEffectBase {
}

// 背景色エフェクト
export class BGColorEffect {
    constructor(onChange, effectID) {
        this._enableCheckboxID = effectID + "Checkbox";
        this._colorID = effectID + "Color";
        this._defaultColor = this._getColor();
        this._alphaRangeID = effectID + "AlphaRange";
        this._alphaNumberID = effectID + "AlphaNumber";
        this._defaultAlpha = this._getAlpha();
        // Checkboxイベント登録
        common.addEventListener(this._enableCheckboxID, "input", onChange);
        // リセットボタンイベント登録
        common.addEventListener(effectID + "ResetButton", "click", () => {
            this.resetValue();
            onChange();
        });
        // Colorのイベント登録
        common.addEventListener(this._colorID, "input", () => {
            this._setCheckbox(true);
            onChange();
        });
        // RangeとNumberのイベント登録
        common.setupRangeAndNumberInput(this._alphaRangeID, this._alphaNumberID, parseFloat, () => {
            this._setCheckbox(true);
            onChange();
        });
    }

    // チェックボックス取得
    _getCheckboxChecked() {
        const checkbox = document.getElementById(this._enableCheckboxID);
        return checkbox && checkbox.checked; 
    }

    // チェックボックス設定
    _setCheckbox(isChecked) {
        document.getElementById(this._enableCheckboxID).checked = isChecked;
    }
    
    // 値初期化
    resetValue() {
        this._setCheckbox(false);
        this._setColor(this._defaultColor);
        this._setAlpha(this._defaultAlpha);
    }

    // rgbaカラー取得
    getRGBAColorIfChecked() {
        let color = this._getColor();
        let alpha = this._getAlpha();
        if (!this._getCheckboxChecked()) {
            color = this._defaultColor;
            alpha = this._defaultAlpha;
        }
        return `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${alpha})`;
    }

    // カラー取得
    _getColor() {
        return document.getElementById(this._colorID).value;
    }

    // カラー設定
    _setColor(color) {
        document.getElementById(this._colorID).value = color;
    }

    // 値取得
    _getAlpha() {
        return parseFloat(document.getElementById(this._alphaRangeID).value);
    }

    // 値設定
    _setAlpha(value) {
        document.getElementById(this._alphaRangeID).value = value;
        document.getElementById(this._alphaNumberID).value = value;
    }
}

// ぼかしエフェクト
export class BlurEffefct extends SingleParameterEffectBase {
    _getFilterFormat() { return "blur([value]px)"; }
}

// 輝度エフェクト
export class BrightnessEffect extends SingleFloatParameterEffectBase {
    _getFilterFormat() { return "brightness([value])"; }
}

// コントラストエフェクト
export class ContrastEffect extends SingleFloatParameterEffectBase {
    _getFilterFormat() { return "contrast([value]%)"; }
}

// ドロップシャドウエフェクト
export class DropShadowEffect {
    constructor(onChange, effectID, scaleEffect = null) {
        this._enableCheckboxID = effectID + "Checkbox";
        this._offsetXRangeID = effectID + "OffsetXRange";
        this._offsetXNumberID = effectID + "OffsetXNumber";
        this._offsetYRangeID = effectID + "OffsetYRange";
        this._offsetYNumberID = effectID + "OffsetYNumber";
        this._defaultOffset = this.getOffset();
        this._blurRangeID = effectID + "BlurRange";
        this._blurNumberID = effectID + "BlurNumber";
        this._defaultBlur = this.getBlur();
        this._colorID = effectID + "Color";
        this._defaultColor = this._getColor();
        this._alphaRangeID = effectID + "AlphaRange";
        this._alphaNumberID = effectID + "AlphaNumber";
        this._defaultAlpha = this._getAlpha();        
        this._scaleEffect = scaleEffect;
        // Checkboxイベント登録
        common.addEventListener(this._enableCheckboxID, "input", onChange);
        // リセットボタンイベント登録
        common.addEventListener(effectID + "ResetButton", "click", () => { this.resetValue(); onChange(); });

        // RangeとNumberのイベント登録
        const onChangeWithSetCheckbox = () => {
            this._setCheckbox(true);
            onChange();
        };
        common.setupRangeAndNumberInput(this._offsetXRangeID, this._offsetXNumberID, parseInt, onChangeWithSetCheckbox);
        common.setupRangeAndNumberInput(this._offsetYRangeID, this._offsetYNumberID, parseInt, onChangeWithSetCheckbox);
        common.setupRangeAndNumberInput(this._blurRangeID, this._blurNumberID, parseInt, onChangeWithSetCheckbox);
        common.addEventListener(this._colorID, "input", onChangeWithSetCheckbox);
        common.setupRangeAndNumberInput(this._alphaRangeID, this._alphaNumberID, parseFloat, onChangeWithSetCheckbox);
    }

    // フィルター文字列取得
    getFilter() {
        if (this.getCheckboxChecked()) {
            const offset = this.getOffset();
            const scale = (this._scaleEffect?.getCheckboxChecked() ?? false) ? this._scaleEffect.getValue() : 1;
            const color = this._getColor();
            const alpha = this._getAlpha();
            const rgbaColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${alpha})`;
            return `drop-shadow(${offset.x * scale}px ${offset.y * scale}px ${this.getBlur() * scale}px ${rgbaColor})`;
        }
        else {
            return "";
        }
    }

    // チェックボックス取得
    getCheckboxChecked() {
        const checkbox = document.getElementById(this._enableCheckboxID);
        return checkbox && checkbox.checked; 
    }

    // チェックボックス設定
    _setCheckbox(isChecked) {
        document.getElementById(this._enableCheckboxID).checked = isChecked;
    }
    
    // 値初期化
    resetValue() {
        this._setCheckbox(false);
        this._setOffset(this._defaultOffset);
        this._setBlur(this._defaultBlur);
        this._setColor(this._defaultColor);
        this._setAlpha(this._defaultAlpha);
    }

    // オフセット取得
    getOffset() {
        return {
            x: parseInt(document.getElementById(this._offsetXRangeID).value),
            y: parseInt(document.getElementById(this._offsetYRangeID).value),
        };
    }

    // オフセット設定
    _setOffset(offset) {
        document.getElementById(this._offsetXRangeID).value = offset.x;
        document.getElementById(this._offsetXNumberID).value = offset.x;
        document.getElementById(this._offsetYRangeID).value = offset.y;
        document.getElementById(this._offsetYNumberID).value = offset.y;
    }

    // ブラー取得
    getBlur() {
        return parseInt(document.getElementById(this._blurRangeID).value);
    }

    // ブラー設定
    _setBlur(blur) {
        document.getElementById(this._blurRangeID).value = blur;
        document.getElementById(this._blurNumberID).value = blur;
    }

    // カラー取得
    _getColor() {
        return document.getElementById(this._colorID).value;
    }

    // カラー設定
    _setColor(color) {
        document.getElementById(this._colorID).value = color;
    }
    
    // 値取得
    _getAlpha() {
        return parseFloat(document.getElementById(this._alphaRangeID).value);
    }

    // 値設定
    _setAlpha(value) {
        document.getElementById(this._alphaRangeID).value = value;
        document.getElementById(this._alphaNumberID).value = value;
    }
}

// グレースケールエフェクト
export class GrayscaleEffect extends SingleFloatParameterEffectBase {
    _getFilterFormat() { return "grayscale([value]%)"; }
}

// 色相回転エフェクト
export class HueRotateEffect extends SingleParameterEffectBase {
    _getFilterFormat() { return "hue-rotate([value]deg)"; }
}

// 色反転エフェクト
export class InvertEffect extends SingleFloatParameterEffectBase {
    _getFilterFormat() { return "invert([value]%)"; }
}

// 透過エフェクト
export class OpacityEffect extends SingleFloatParameterEffectBase {
    _getFilterFormat() { return "opacity([value]%)"; }
}

// 彩度エフェクト
export class SaturateEffect extends SingleFloatParameterEffectBase {
    _getFilterFormat() { return "saturate([value]%)"; }
}