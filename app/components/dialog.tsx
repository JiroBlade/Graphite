import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { ElementProps } from "./tauri";
import dialog from '../css/dialog.module.css'

interface DialogWindowProps extends ElementProps {

}

const Window = forwardRef<HTMLDivElement>((props: DialogWindowProps, forwardedRef) => {
    const { role, children, ...listProps } = props
    const ref = useRef<HTMLDivElement>()

    useImperativeHandle(forwardedRef, () => ref.current as HTMLDivElement)

    useEffect(() => {
        document.addEventListener('keydown', e => {
            if(e.key == 'Escape') {
                ref.current.hidden = true
            }
        })
    })

    return(
        <div ref={ref} role={role} className={dialog.dialogRoot} hidden>
            <div className={dialog.dialogWindow}>
                {children}
            </div>
        </div>
    )
})

interface TabsTriggerProps extends ElementProps {
    value: string
    onClick: any
}

const Trigger = forwardRef<HTMLButtonElement>((props: TabsTriggerProps, ref) => {
    const { value, onClick, ...listProps } = props

    return <button ref={ref} value={value} onClick={onClick} {...listProps}></button>
})

interface DialogHeaderProps extends ElementProps {
    title: string
    onClick: any
}

const Header = forwardRef<HTMLDivElement>((props: DialogHeaderProps, ref) => {
    const { title, onClick, ...listProps } = props

    return(
        <div ref={ref}>
            <button className={dialog.dialogClose} onClick={onClick}>&times;</button>
            <div className={dialog.dialogTitle}>{title}</div>
        </div>
    )
})

export { Window, Trigger, Header }