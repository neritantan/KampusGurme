import React from 'react';
import { Flame, Drumstick, Wheat, Droplet } from 'lucide-react';

const NutritionRow = ({ nutrition }) => {
    // nutrition: { kcal, prot, carb, fat }

    const itemStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    };

    const labelStyle = {
        fontSize: '0.7rem',
        color: '#888',
        fontWeight: '700',
        marginTop: '4px',
        textTransform: 'uppercase'
    };

    const valueStyle = {
        fontSize: '1rem',
        fontWeight: '800',
        color: 'white',
        marginTop: '2px'
    };

    const dividerStyle = {
        width: '1px',
        height: '30px',
        background: '#333'
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#1C1C1E', // Dark Card Bg
            borderRadius: '24px',
            padding: '15px 10px',
            marginBottom: '20px',
            marginTop: '30px', // Added spacing
            border: '1px solid #2C2C2E'
        }}>
            {/* Kcal */}
            <div style={itemStyle}>
                <Flame size={20} color="#FF6600" fill="#FF6600" fillOpacity={0.2} />
                <div style={valueStyle}>{Math.round(nutrition.kcal)}</div>
                <div style={labelStyle}>KCAL</div>
            </div>

            <div style={dividerStyle}></div>

            {/* Protein */}
            <div style={itemStyle}>
                <Drumstick size={20} color="#FF6600" />
                <div style={valueStyle}>{Math.round(nutrition.prot)}g</div>
                <div style={labelStyle}>PROT</div>
            </div>

            <div style={dividerStyle}></div>

            {/* Carb */}
            <div style={itemStyle}>
                <Wheat size={20} color="#FF6600" />
                <div style={valueStyle}>{Math.round(nutrition.carb)}g</div>
                <div style={labelStyle}>KARB</div>
            </div>

            <div style={dividerStyle}></div>

            {/* Fat */}
            <div style={itemStyle}>
                <Droplet size={20} color="#FF6600" fill="#FF6600" fillOpacity={0.2} />
                <div style={valueStyle}>{Math.round(nutrition.fat)}g</div>
                <div style={labelStyle}>YAĞ</div>
            </div>
        </div>
    );
};

export default NutritionRow;
