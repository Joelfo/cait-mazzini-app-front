import { left } from "@popperjs/core"
import { Button, Col, Form, Row } from "react-bootstrap"
import { RichTextEditorOption } from "./types/enums/RichTextEditorOption";
import { useRef, useState } from "react";
import { text } from "stream/consumers";

//Based on: https://codingartistweb.com/2022/04/rich-text-editor-with-javascript/
export const RichTextEditor = () => {

    const textAreaRef = useRef<HTMLDivElement | null>(null);

    const [textAreaInnerHtml, setTextAreaInnerHTML] = useState<string>(''); 

    const handleChange = (event : React.FormEvent<HTMLDivElement>) => {
        setTextAreaInnerHTML(event.currentTarget.innerHTML + " Teste");
    }

    const changeText = (option: RichTextEditorOption) => {
        if (textAreaRef.current) {
            const textAreaNode = textAreaRef.current;
            const selection = window.getSelection();

            if (!(!!selection && textAreaNode.contains(selection.anchorNode) && textAreaNode.contains(selection.focusNode))) {
                return;
            }

            const textAreaContent = textAreaNode.innerHTML;
            const selectedText = selection.toString();
            const selectionStart = textAreaContent.indexOf(selectedText);
            const selectionEnd = selectionStart + selectedText.length;

            let htmlChangingTagStart = "";
            let htmlChangingTagEnd = "";
            
            switch (option) {
                case RichTextEditorOption.Bold:
                    htmlChangingTagStart = "<strong>";
                    htmlChangingTagEnd = "</strong>";
                    break;
                case RichTextEditorOption.Italic:
                    htmlChangingTagStart = "<em>";
                    htmlChangingTagEnd = "</em>";
                    break;
                case RichTextEditorOption.Underline:
                    htmlChangingTagStart = "<u>";
                    htmlChangingTagEnd = "</u>";

            }

            textAreaNode.innerHTML = textAreaContent.slice(0, selectionStart) + htmlChangingTagStart + textAreaContent.slice(selectionStart, selectionEnd) + htmlChangingTagEnd + textAreaContent.slice(selectionEnd);
        }
    }

    return (
        <div>
            <div className="bg-primary d-flex justify-content-start rounded-top">
                    <Button onClick={() => changeText(RichTextEditorOption.Bold)}>
                        <i className="bi bi-type-bold"></i>
                    </Button>
                    <Button>
                        <i className="bi bi-type-italic"></i>
                    </Button>
                    <Button>
                        <i className="bi bi-type-underline"></i>
                    </Button>
                    <Button>
                        <i className="bi bi-superscript"></i>
                    </Button>
                    <Button>
                        <i className="bi bi-subscript"></i>
                    </Button>
                    <Button>
                        <i className="bi bi-list-ol"></i>
                    </Button>
                    <Button>
                        <i className="bi bi-list-ul"></i>
                    </Button>
                    <Button>
                        <i className="bi bi-arrow-counterclockwise"></i>
                    </Button>
                    <Button>
                        <i className="bi bi-arrow-clockwise"></i>
                    </Button>
                    <Button>
                        <i className="bi bi-link"></i>
                    </Button>
                    <Button>
                        <i className="bi bi-text-left"></i>
                    </Button>
                    <Button>
                        <i className="bi bi-text-center"></i>
                    </Button>
                    <Button>
                        <i className="bi bi-text-right"></i>
                    </Button>
                    <Button>
                        <i className="bi bi-justify"></i>
                    </Button>
                    <Button>
                        <i className="bi bi-text-indent-left"></i>
                    </Button>
                    <Button>
                        <i className="bi bi-text-indent-right"></i>
                    </Button>
                </div>
                
            <div>
                <div ref={textAreaRef} className="shadow-none" contentEditable={true} dangerouslySetInnerHTML={{__html: textAreaInnerHtml}} onInput={(event) => {handleChange(event)}} style={{ height: '300px', borderTopLeftRadius: '0', borderTopRightRadius:'0', width:'100%', backgroundColor: "#FFF" }}/> 
            </div>
        </div>
    )
}