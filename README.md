# ImageContextFilter

画像をプレビューしながら、画像効果処理を行うWebページのリポジトリです。

CanvasRenderingContext2Dのfilterプロパティを使用しているため、現状Safariでは動作しないようです。

https://damungames.github.io/ImageContextFilter/

## 使用方法

「画像を選択」ボタンで画像をアップロードできます、画像の貼り付けやドラッグ&ドロップにも対応しています(一部例外を除く)。

反映したいエフェクトの値をスライダー等で操作するとエフェクトが反映されます。  
各エフェクトのチェックボックスを外すと、そのエフェクトは無効化されます。

エフェクトをドラッグ&ドロップで並び変えると、エフェクトの順番が変更されます。  
(スケール、背景色は順番が考慮されません)