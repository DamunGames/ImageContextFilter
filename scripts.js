// scripts.js

import * as effects from "./effects.js";

// エフェクトID定数
const scaleEffectID = "scaleEffect";
const bgColorEffectID = "bgColorEffect";
const blurEffectID = "blurEffect";
const brightnessEffectID = "brightnessEffect";
const contrastEffectID = "contrastEffect";
const dropShadowEffectID = "dropShadowEffect";
const grayscaleEffectID = "grayscaleEffect";
const hueRotateEffectID = "hueRotateEffect";
const invertEffectID = "invertEffect";
const opacityEffectID = "opacityEffect";
const saturateEffectID = "saturateEffect";

const infoLabel = document.getElementById("infoLabel");

const previewCanvas = document.getElementById("previewCanvas");
const previewImage = new Image();

let showImageName = "";
let isImageLoaded = false;

// エフェクトIDとエフェクトクラスの連想配列
const scaleEffect = new effects.ScaleEffect(drawImage, scaleEffectID.slice(0, -6));
const bgColorEffect = new effects.BGColorEffect(drawImage, bgColorEffectID.slice(0, -6));
const idsEffectMap = {
    [blurEffectID]: new effects.BlurEffefct(drawImage, blurEffectID.slice(0, -6), scaleEffect),
    [brightnessEffectID]: new effects.BrightnessEffect(drawImage, brightnessEffectID.slice(0, -6)),
    [contrastEffectID]: new effects.ContrastEffect(drawImage, contrastEffectID.slice(0, -6)),
    [dropShadowEffectID]: new effects.DropShadowEffect(drawImage, dropShadowEffectID.slice(0, -6), scaleEffect),
    [grayscaleEffectID]: new effects.GrayscaleEffect(drawImage, grayscaleEffectID.slice(0, -6)),
    [hueRotateEffectID]: new effects.HueRotateEffect(drawImage, hueRotateEffectID.slice(0, -6)),
    [invertEffectID]: new effects.InvertEffect(drawImage, invertEffectID.slice(0, -6)),
    [opacityEffectID]: new effects.OpacityEffect(drawImage, opacityEffectID.slice(0, -6)),
    [saturateEffectID]: new effects.SaturateEffect(drawImage, saturateEffectID.slice(0, -6)),
};

// ソート後のエフェクトIDリスト
let sortedEffectIDs = [
    blurEffectID,
    brightnessEffectID,
    contrastEffectID,
    dropShadowEffectID,
    grayscaleEffectID,
    hueRotateEffectID,
    invertEffectID,
    opacityEffectID,
    saturateEffectID,
];

// 初期化処理
(function() {
    initializeImage();
    initializeInputEvents();
    initializeEffects();
})();

// 画像読み込み
function loadImage(url, imageName = null) {
    const name = (imageName ? imageName : url);
    setShowImageName(name);
    setIsImageLoaded(false);
    setVisibleCanvas(false);
    setInfo(url);
    previewImage.src = url;
}

// Fileオブジェクト読み込み
function loadImageFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    loadImage(URL.createObjectURL(file), file.name);
}

// 画像onloadイベント
function onloadImage() {
    try {
        setIsImageLoaded(true);
        setVisibleCanvas(true);
        drawImage();
    }
    catch (error) {
        console.error("onloadImage: " + error);
        alert("画像の読み込み中にエラーが発生しました。別の画像を試してみてください。");
    }
    finally {
        URL.revokeObjectURL(previewImage.src);
    }
}

// 画像onerrorイベント
function onerrorImage() {
    setIsImageLoaded(false);
    setVisibleCanvas(false);
    URL.revokeObjectURL(previewImage.src);
    console.error("onerrorImage: " + previewImage.src);
    alert("画像の読み込み中にエラーが発生しました。別の画像を試してみてください。");
}

// 画像描画
function drawImage() {
    if (!isImageLoaded) return;
    setBGColor();
    const params = getPreviewParams();
    resizeCanvas(previewCanvas, params.size, params.scale);
    const ctx = previewCanvas.getContext("2d");
    ctx.filter = params.filter;
    ctx.drawImage(previewImage, params.offset.x, params.offset.y);
}

// 背景色設定
function setBGColor() {
    const rgbaColor = bgColorEffect.getRGBAColorIfChecked();
    document.getElementById("previewCanvas").style.backgroundColor = rgbaColor;
}

// キャンバスサイズ更新
function resizeCanvas(canvas, size, scale) {
    const ctx = canvas.getContext("2d");
    canvas.width = size.width * scale;
    canvas.height = size.height * scale;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(scale, scale);
}

// キャンバスの表示設定
function setVisibleCanvas(isVisible) {
    const dropArea = document.getElementById("dropArea");
    dropArea.style = "display: " + (!isVisible ?  "inline-block;" : "none;");
    previewCanvas.style = "display: " + (isVisible ?  "inline-block;" : "none;");
}

// 画像表示名設定
function setShowImageName(name) {
    showImageName = name;
}

// 画像読み込み済みフラグ設定
function setIsImageLoaded(isLoaded) {
    isImageLoaded = isLoaded;
}

// 情報設定
function setInfo(text) {
    infoLabel.textContent = text;
}

// 画像URL判定
function isImageURL (url) {
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg)$/i;
    return imageExtensions.test(url);
}

// プレビューパラメータ取得
function getPreviewParams() {
    // サイズ、オフセット計算
    let size = {
        width: previewImage.width,
        height: previewImage.height,
    };
    let offset = {
        x: 0,
        y: 0,
    };

    // エフェクトから計算に関係するパラメータ取得
    // 拡縮エフェクト
    const scale = (scaleEffect?.getCheckboxChecked() ?? false) ? scaleEffect.getValue() : 1;
    // ぼかしエフェクト
    const blurScale = 2.5;  // ぼかしが影響する範囲までのスケール
    const blurEffect = idsEffectMap[[blurEffectID]];
    let blur = (blurEffect.getCheckboxChecked() ? blurEffect.getValue() * blurScale : 0);
    
    // ドロップシャドウエフェクト
    const dropShadowEffect = idsEffectMap[[dropShadowEffectID]];
    let shadowOffset = dropShadowEffect.getOffset();
    // シャドウには通常のぼかしも反映されるので、大きい方のぼかしを計算に採用
    let shadowBlur = Math.max(blur, dropShadowEffect.getBlur() * blurScale);
    // ドロップシャドウのサイズを計算から除外
    if (!dropShadowEffect.getCheckboxChecked()) {
        shadowOffset = { x: 0, y: 0 }; 
        shadowBlur = 0;
    }

    // サイズ計算
    const leftTopPadding = {
        x: Math.min(-blur, shadowOffset.x - shadowBlur),
        y: Math.min(-blur, shadowOffset.y - shadowBlur),
    };
    const rightBottomPadding = {
        x: Math.max(blur, shadowOffset.x + shadowBlur),
        y: Math.max(blur, shadowOffset.y + shadowBlur),
    };
    size.width += (rightBottomPadding.x - leftTopPadding.x);
    size.height += (rightBottomPadding.y - leftTopPadding.y);

    // オフセット計算
    offset.x = Math.max(blur, shadowBlur - shadowOffset.x, 0);
    offset.y = Math.max(blur, shadowBlur - shadowOffset.y, 0);

    // フィルター合算
    let filter = "";
    sortedEffectIDs.forEach(id => {
        filter += idsEffectMap[id]?.getFilter() ?? "";
    });
    if (filter == "") {
        filter = "none";
    }

    return {
        size: size,
        scale: [scale],
        offset: offset,
        filter: filter,
    };
}

// 画像関係初期化
function initializeImage() {
    // 画像読み込みイベント登録
    previewImage.onload = onloadImage;
    previewImage.onerror = onerrorImage;
}

// 入力イベント関係初期化
function initializeInputEvents() {
    // ファイル入力イベント登録
    const fileInput = document.getElementById("fileInput");
    fileInput.addEventListener("change", (event) => {
        loadImageFile(event.target.files[0]);
    });

    // ドロップエリアのクリックイベント登録
    const dropArea = document.getElementById("dropArea");
    dropArea.addEventListener("click", () => {
        fileInput.click();
    });

    // プレビューのクリックイベント登録
    previewCanvas.addEventListener("click", () => {
        fileInput.click();
    });

    // ドラッグ＆ドロップのイベント登録
    document.addEventListener("dragover", (event) => {
        event.preventDefault();     // デフォルトの挙動をキャンセル
    });
    document.addEventListener("drop", (event) => {
        event.preventDefault();     // デフォルトの挙動をキャンセル
        const url = event.dataTransfer.getData("text/plain");
        console.log("url: " + url);
        if (isImageURL(url)) {
            // URLの画像読み込み
            loadImage(url);
        }
        else {
            // ファイルの画像読み込み
            loadImageFile(event.dataTransfer.files[0]);
        }
    });

    // 貼り付けイベント登録
    document.addEventListener("paste", (event) => {
        const clipboardData = event.clipboardData || window.clipboardData;
        const url = clipboardData.getData("text/plain");
        if (isImageURL(url)) {
            // URLの画像読み込み
            loadImage(url);
        }    
        else {
            // ファイルの画像読み込み
            loadImageFile(clipboardData.files[0]);
        }
    });
}

// エフェクト関係初期化
function initializeEffects() {
    // 並び変え可能設定
    $(".effectSortable").sortable();

    // 並び変えイベント登録
    $(".effectSortable").on("sortupdate", function(event, ui) {
        // 並び変わった項目目の順番を取得
        sortedEffectIDs = $(this).sortable("toArray");
        // 新たな順番で描画
        drawImage();
    });
}