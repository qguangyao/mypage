import React, { useEffect, useRef } from 'react';
import varificationCode from '.';
import './index.css';


const icoSuccess = require("./icon/success.png")
const icoError = require("./icon/error.png")
const icoReload = require("./icon/reload.png")
const icoSlider = require("./icon/slider.png")

const verificationbg = require("./icon/verificationbg.jpeg")

const STATUS_LOADING = 0 // 还没有图片
const STATUS_READY = 1 // 图片渲染完成,可以开始滑动
const STATUS_MATCH = 2 // 图片位置匹配成功
const STATUS_ERROR = 3 // 图片位置匹配失败
 
const arrTips = [{ ico: icoSuccess, text: "匹配成功" }, { ico: icoError, text: "匹配失败" }]

// 生成裁剪路径
function createClipPath(ctx, size = 100, styleIndex = 0) {
    const styles = [
        [0, 0, 0, 0],
        [0, 0, 0, 1],
        [0, 0, 1, 0],
        [0, 0, 1, 1],
        [0, 1, 0, 0],
        [0, 1, 0, 1],
        [0, 1, 1, 0],
        [0, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 0, 0, 1],
        [1, 0, 1, 0],
        [1, 0, 1, 1],
        [1, 1, 0, 0],
        [1, 1, 0, 1],
        [1, 1, 1, 0],
        [1, 1, 1, 1]
    ]
    const style = styles[styleIndex]
 
    const r = 0.1 * size
    ctx.save()
    ctx.beginPath()
    // left
    ctx.moveTo(r, r)
    ctx.lineTo(r, 0.5 * size - r)
    ctx.arc(r, 0.5 * size, r, 1.5 * Math.PI, 0.5 * Math.PI, style[0])
    ctx.lineTo(r, size - r)
    // bottom
    ctx.lineTo(0.5 * size - r, size - r)
    ctx.arc(0.5 * size, size - r, r, Math.PI, 0, style[1])
    ctx.lineTo(size - r, size - r)
    // right
    ctx.lineTo(size - r, 0.5 * size + r)
    ctx.arc(size - r, 0.5 * size, r, 0.5 * Math.PI, 1.5 * Math.PI, style[2])
    ctx.lineTo(size - r, r)
    // top
    ctx.lineTo(0.5 * size + r, r)
    ctx.arc(0.5 * size, r, r, 0, Math.PI, style[3])
    ctx.lineTo(r, r)
 
    ctx.clip()
    ctx.closePath()
}


function draw(ctx, location, ref) {
    // ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
    const canv = ref.current
    // console.log('location.x:',location.x);
    // console.log('location.y:',location.y);
    // console.log('canv.offsetLeft:',canv.offsetLeft);
    // console.log('canv.offsetTop:',canv.offsetTop);
    ctx.fillStyle = 'deepskyblue'
    ctx.shadowColor = 'dodgerblue'
    ctx.shadowBlur = 20
    ctx.save()
    console.log('ctx:', ctx)
    // ctx.scale(SCALE, SCALE)
    // ctx.translate(location.x / SCALE - OFFSET, location.y / SCALE - OFFSET)
    // ctx.translate((location.x-canv.offsetLeft), (location.y-canv.offsetTop))
    // ctx.fill(HOOK_PATH)
    // ctx.fillRect(0,0,window.innerWidth,window.innerHeight);

    createClipPath((location.x - canv.offsetLeft), (location.y - canv.offsetTop), ctx, 100)
    ctx.fill();
    ctx.restore()
}

// export default () => {
//     const canvasRef = React.useRef(null);
//     return (
//         <div>
//             <h1 className={styles.title}>RandomImageVarification</h1>
//             <div style={{ backgroundColor: 'red', overflow: 'hidden', }}>
//                 <canvas ref={canvasRef}
//                     width={window.innerWidth}
//                     height={window.innerHeight}
//                     onClick={e => {
//                         const canvas = canvasRef.current
//                         const ctx = canvas.getContext('2d')
//                         var bg = new Image();
//                         bg.src = varificationCode;
//                         ctx.drawImage(bg, 0, 0);
//                         draw(ctx, { x: e.clientX, y: e.clientY }, canvasRef)
//                     }}
//                 />
//             </div>

//         </div>
//     );
// }

class RandomImageVarification extends React.Component {
    static defaultProps = {
        imageUrl: "",
        imageWidth: 500,
        imageHeight: 300,
        fragmentSize: 80,
        onReload: () => {},
        onMatch: () => {},
        onError: () => {}
    }
 
    state = {
        isMovable: false,
        offsetX: 0, //图片截取的x
        offsetY: 0, //图片截取的y
        startX: 0, // 开始滑动的 x
        oldX: 0,
        currX: 0, // 滑块当前 x,
        status: STATUS_LOADING,
        showTips: false,
        tipsIndex: 0
    }
    componentDidMount(){
        if (!!this.props.imageUrl) {
            this.renderImage()
        }
    }
 
    componentDidUpdate(prevProps) {
        // 当父组件传入新的图片后，开始渲染
        console.log('componentDidUpdate');
        if (!!this.props.imageUrl && prevProps.imageUrl !== this.props.imageUrl) {
            this.renderImage()
        }
    }
 
    renderImage = () => {
        console.log('renderImage');
        // 初始化状态
        this.setState({ status: STATUS_LOADING })
 
        // 创建一个图片对象，主要用于canvas.context.drawImage()
        const objImage = new Image()
 
        objImage.addEventListener("load", () => {
            const { imageWidth, imageHeight, fragmentSize } = this.props
 
            // 先获取两个ctx
            const ctxShadow = this.refs.shadowCanvas.getContext("2d")
            const ctxFragment = this.refs.fragmentCanvas.getContext("2d")
 
            // 让两个ctx拥有同样的裁剪路径(可滑动小块的轮廓)
            const styleIndex = Math.floor(Math.random() * 16)
            createClipPath(ctxShadow, fragmentSize, styleIndex)
            createClipPath(ctxFragment, fragmentSize, styleIndex)
 
            // 随机生成裁剪图片的开始坐标
            const clipX = Math.floor(fragmentSize + (imageWidth - 2 * fragmentSize) * Math.random())
            const clipY = Math.floor((imageHeight - fragmentSize) * Math.random())
 
            // 让小块绘制出被裁剪的部分
            ctxFragment.drawImage(objImage, clipX, clipY, fragmentSize, fragmentSize, 0, 0, fragmentSize, fragmentSize)
 
            // 让阴影canvas带上阴影效果
            ctxShadow.fillStyle = "rgba(0, 0, 0, 0.5)"
            ctxShadow.fill()
 
            // 恢复画布状态
            ctxShadow.restore()
            ctxFragment.restore()
 
            // 设置裁剪小块的位置
            this.setState({ offsetX: clipX, offsetY: clipY })
 
            // 修改状态
            this.setState({ status: STATUS_READY })
        })
 
        objImage.src = this.props.imageUrl
    }
 
    onMoveStart = e => {
        if (this.state.status !== STATUS_READY) {
            return
        }
 
        // 记录滑动开始时的绝对坐标x
        this.setState({ isMovable: true, startX: e.clientX })
    }
 
    onMoving = e => {
        if (this.state.status !== STATUS_READY || !this.state.isMovable) {
            return
        }
        const distance = e.clientX - this.state.startX
        let currX = this.state.oldX + distance
 
        const minX = 0
        const maxX = this.props.imageWidth - this.props.fragmentSize
        currX = currX < minX ? 0 : currX > maxX ? maxX : currX
 
        this.setState({ currX })
    }
 
    onMoveEnd = () => {
        if (this.state.status !== STATUS_READY || !this.state.isMovable) {
            return
        }
        // 将旧的固定坐标x更新
        this.setState(pre => ({ isMovable: false, oldX: pre.currX }))
 
        const isMatch = Math.abs(this.state.currX - this.state.offsetX) < 5
        if (isMatch) {
            this.setState(pre => ({ status: STATUS_MATCH, currX: pre.offsetX }), this.onShowTips)
            this.props.onMatch()
        } else {
            this.setState({ status: STATUS_ERROR }, () => {
                this.onReset()
                this.onShowTips()
            })
            this.props.onError()
        }
    }
 
    onReset = () => {
        const timer = setTimeout(() => {
            this.setState({ oldX: 0, currX: 0, status: STATUS_READY })
            clearTimeout(timer)
        }, 1000)
    }
 
    onReload = () => {
        console.log('onReload',this.state.status);
        this.renderImage()
        if (this.state.status !== STATUS_READY && this.state.status !== STATUS_MATCH) {
            return
        }
        const ctxShadow = this.refs.shadowCanvas.getContext("2d")
        const ctxFragment = this.refs.fragmentCanvas.getContext("2d")
 
        // 清空画布
        ctxShadow.clearRect(0, 0, this.props.fragmentSize, this.props.fragmentSize)
        ctxFragment.clearRect(0, 0, this.props.fragmentSize, this.props.fragmentSize)
 
        this.setState(
            {
                isMovable: false,
                offsetX: 0, //图片截取的x
                offsetY: 0, //图片截取的y
                startX: 0, // 开始滑动的 x
                oldX: 0,
                currX: 0, // 滑块当前 x,
                status: STATUS_LOADING
            },
            this.props.onReload
        )
    }
 
    onShowTips = () => {
        if (this.state.showTips) {
            return
        }
 
        const tipsIndex = this.state.status === STATUS_MATCH ? 0 : 1
        this.setState({ showTips: true, tipsIndex })
        const timer = setTimeout(() => {
            this.setState({ showTips: false })
            clearTimeout(timer)
        }, 2000)
    }
 
    render() {
        const { imageUrl, imageWidth, imageHeight, fragmentSize } = this.props
        const { offsetX, offsetY, currX, showTips, tipsIndex } = this.state
        const tips = arrTips[tipsIndex]
        return (
            <div className="image-code" style={{ width: imageWidth }}>
                <div className="image-container" style={{ height: imageHeight, backgroundImage: `url("${imageUrl}")` }}>
                    <canvas
                        ref="shadowCanvas"
                        className="canvas"
                        width={fragmentSize}
                        height={fragmentSize}
                        style={{ left: offsetX + "px", top: offsetY + "px" }}
                    />
                    <canvas
                        ref="fragmentCanvas"
                        className="canvas"
                        width={fragmentSize}
                        height={fragmentSize}
                        style={{ top: offsetY + "px", left: currX + "px" }}
                    />
 
                    <div className={showTips ? "tips-container--active" : "tips-container"}>
                        <i className="tips-ico" style={{ backgroundImage: `url("${tips.ico}")` }} />
                        <span className="tips-text">{tips.text}</span>
                    </div>
                </div>
 
                <div className="reload-container">
                    <div className="reload-wrapper" onClick={this.onReload}>
                        <i className="reload-ico" style={{ backgroundImage: `url("${icoReload}")` }} />
                        <span className="reload-tips">刷新验证</span>
                    </div>
                </div>
 
                <div className="slider-wrpper" onMouseMove={this.onMoving} onMouseLeave={this.onMoveEnd}>
                    <div className="slider-bar">按住滑块，拖动完成拼图</div>
                    <div
                        className="slider-button"
                        onMouseDown={this.onMoveStart}
                        onMouseUp={this.onMoveEnd}
                        style={{ left: currX + "px", backgroundImage: `url("${icoSlider}")` }}
                    />
                </div>
            </div>
        )
    }
}
 
export default RandomImageVarification

