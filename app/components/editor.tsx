import { forwardRef } from "react"
import { ElementProps } from "./tauri"
import styles from '../css/style.module.css'

interface EditorProps extends ElementProps {
    title: string
    value: number
}

const Editor = forwardRef<HTMLDivElement, EditorProps>((props: EditorProps, ref) => {
    const { title, value, children, ...listProps } = props
    /* function rename(e) {
        
        tabsTriggerRef.current[value].textContent = e.target.value

        if(tabsTriggerRef.current[value].textContent == '') {
            tabsTriggerRef.current[value].textContent = 'Untitled Page'
        }
    } */

    return(
        <div ref={ref}>
            <input defaultValue={title} className={styles.title}/>
            <div contentEditable suppressContentEditableWarning>
                {children}
            </div>
        </div>
    )
})

export { Editor }