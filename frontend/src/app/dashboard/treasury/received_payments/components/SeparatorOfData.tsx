import React from 'react';
import './ModalPayment.css';

interface SeparatorOfDataProps {
    title1: string;
    title2: string;
    color?: string
}

export default function SeparatorOfData({ title1, title2, color }: SeparatorOfDataProps) {
    return (
        <div className='divOfSeparatedInfo'>
            <div>{title1}:</div>
            {color ? <div style={{color: color}}>{title2}</div> :  <div>{title2}</div>}
        </div>
    );
}
