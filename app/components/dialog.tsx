import * as React from "react"
import dialog from '../css/dialog.module.css'
import { ElementProps } from "./tauri"

interface DialogRootProps extends ElementProps {

}

const Root = React.forwardRef<HTMLDivElement, DialogRootProps>((props: DialogRootProps, forwardedRef) => {
    const { ...listProps } = props
    const ref = React.useRef<HTMLDivElement>()

    React.useImperativeHandle(forwardedRef, () => ref.current as HTMLDivElement)

    React.useEffect(() => {
        document.addEventListener('keydown', e => {
            if(e.key === 'Escape') {
                ref.current.hidden = true
            }
        })
    })

    return <div ref={ref} {...listProps} id={dialog.dialogRoot} hidden/>
})

interface DialogWindowProps extends ElementProps {
    
}

const Window = React.forwardRef<HTMLDivElement, DialogWindowProps>((props: DialogWindowProps, ref) => {
    const { ...listProps } = props

    return <div {...listProps} ref={ref} hidden/>
})

interface DialogTriggerProps extends ElementProps {
    onClick: any
    value: string
}

const Trigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>((props: DialogTriggerProps, ref) => {
    const { onClick, value, ...listProps } = props

    return <button ref={ref} {...listProps} onClick={onClick} value={value}/>
})

interface DialogCloseProps extends ElementProps {
    onClick: any
}

const Close = React.forwardRef<HTMLButtonElement, DialogCloseProps>((props: DialogCloseProps, ref) => {
    const { onClick, ...listProps } = props

    return <button {...listProps} onClick={onClick}>&times;</button>
})

export { Root, Window, Trigger, Close }