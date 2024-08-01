// clips.cs

export class CircleClip {
    clip(ctx, sliderVlue) {
        const radius = Math.min(ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        ctx.arc(ctx.canvas.width / 2, ctx.canvas.height / 2, radius * parseFloat(sliderVlue) / 100, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
    }
}

export class BorderRadiusClip {
    clip(ctx, sliderValue) {
        const radius = Math.min(ctx.canvas.width, ctx.canvas.height);
        const borderRadiusValue = (radius * parseFloat(sliderValue)) / 100;
        ctx.beginPath();
        ctx.moveTo(borderRadiusValue, 0);
        ctx.lineTo(ctx.canvas.width - borderRadiusValue, 0);
        ctx.quadraticCurveTo(ctx.canvas.width, 0, ctx.canvas.width, borderRadiusValue);
        ctx.lineTo(ctx.canvas.width, ctx.canvas.height - borderRadiusValue);
        ctx.quadraticCurveTo(ctx.canvas.width, ctx.canvas.height, ctx.canvas.width - borderRadiusValue, ctx.canvas.height);
        ctx.lineTo(borderRadiusValue, ctx.canvas.height);
        ctx.quadraticCurveTo(0, ctx.canvas.height, 0, ctx.canvas.height - borderRadiusValue);
        ctx.lineTo(0, borderRadiusValue);
        ctx.quadraticCurveTo(0, 0, borderRadiusValue, 0);
        ctx.closePath();
        ctx.clip();
    }
}