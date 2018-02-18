import * as React from 'react';
import { SketchPicker, ColorChangeHandler } from "react-color";

export const Toolbar = (
    props: 
    {
        onColorChange: ColorChangeHandler
    }
) => {
    <SketchPicker onChange={props.onColorChange}/>
}