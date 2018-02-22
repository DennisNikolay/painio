import * as React from 'react';
import { SketchPicker, ColorChangeHandler } from 'react-color';

export const Toolbar = (
    props: 
    {
        onColorChangeComplete: ColorChangeHandler,
        color: string
    }
) => <SketchPicker onChangeComplete={props.onColorChangeComplete} color={props.color}/>;