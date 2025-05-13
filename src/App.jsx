import { useState } from 'react';
import './App.css';
import logo from './images/Noctua_Primary-Logo_Almond.png';
import jsPDF from 'jspdf';


const recipes = {

    'Hybrid Luca Base': {
        ingredients: [
            { ingredient: 'Whole Milk', amount: 5320.00 },
            { ingredient: 'Heavy Cream', amount: 380.00 },
            { ingredient: 'Skim Milk Powder', amount: 100.00 },
            { ingredient: 'Sugar', amount: 1110.00 },
            { ingredient: 'Dextrose', amount: 150.00 },
            { ingredient: 'Base Luca 50', amount: 270.00 },
        ],
        baseYield: 8230.00,
    },

    'Milk Base': {
        ingredients: [
            { ingredient: 'Milk', amount: 4000 },
            { ingredient: 'Cream', amount: 598.43 },
            { ingredient: 'Skim Milk Powder', amount: 157.48 },
            { ingredient: 'Dextrose', amount: 78.74 },
            { ingredient: 'Sugar', amount: 787.4 },
            { ingredient: 'Base Luca', amount: 204.72 },
        ],
        baseYield: 5826.77,
    },
    'Strawberry 50%': {
        ingredients: [
            { ingredient: 'Sugar', amount: 225 },
            { ingredient: 'Glucose 38DE', amount: 20 },
            { ingredient: 'Invert Sugar', amount: 12.5 },
            { ingredient: 'Perfecta Plus', amount: 30 },
            { ingredient: 'Water', amount: 200 },
            { ingredient: 'Strawberry', amount: 500 },
            { ingredient: 'Lemon Juice', amount: 12.5 },
        ],
        baseYield: 1000,
    },
    'Watermelon 65%': {
        ingredients: [
            { ingredient: 'Sugar', amount: 150 },
            { ingredient: 'Glucose 38DE', amount: 50 },
            { ingredient: 'Invert Sugar', amount: 25 },
            { ingredient: 'Perfecta Plus', amount: 30 },
            { ingredient: 'Water', amount: 87.5 },
            { ingredient: 'Watermelon', amount: 650 },
            { ingredient: 'Lemon Juice', amount: 7.5 },
        ],
        baseYield: 1000,
    },
    'Caffè Gelato': {
        ingredients: [
            { ingredient: 'Sugar', amount: 138 },
            { ingredient: 'Glucose 38DE', amount: 20 },
            { ingredient: 'LMP', amount: 50 },
            { ingredient: 'Base 100', amount: 75 },
            { ingredient: 'Espresso', amount: 200 },
            { ingredient: 'Whole Milk', amount: 343 },
            { ingredient: 'Cream 35%', amount: 175 },
        ],
        baseYield: 1000,
    },
    'Fruit Purée Sorbet': {
        ingredients: [
            { ingredient: 'Water', amount: 1121 },
            { ingredient: 'Fruit Purée', amount: 1000 },
            { ingredient: 'Frutto Frutto', amount: 848 },
            { ingredient: 'Lemon Juice', amount: 152 },
        ],
        baseYield: 3121,
    },
    'Fat-Driven Base': {
        ingredients: [
            { ingredient: 'Milk', amount: 4000 },
            { ingredient: 'Sugar', amount: 877.70 },
            { ingredient: 'Dextrose', amount: 143.88 },
            { ingredient: 'Base Luca', amount: 201.44 },
        ],
        baseYield: 5222.02,
    },
};

function App() {
    const [selectedRecipe, setSelectedRecipe] = useState('Milk Base');
    const [inputMode, setInputMode] = useState('yield');
    const [desiredYield, setDesiredYield] = useState('');
    const [scalingIngredient, setScalingIngredient] = useState('');
    const [ingredientAmount, setIngredientAmount] = useState('');
    const [scaledRecipe, setScaledRecipe] = useState([]);

    const handleCalculate = () => {
        const { ingredients, baseYield } = recipes[selectedRecipe];
        let scaleFactor = 1;

        if (inputMode === 'yield') {
            scaleFactor = parseFloat(desiredYield) / baseYield;
        } else if (inputMode === 'ingredient' && scalingIngredient) {
            const original = ingredients.find(i => i.ingredient === scalingIngredient);
            if (original) {
                scaleFactor = parseFloat(ingredientAmount) / original.amount;
            }
        }

        const scaled = ingredients.map(item => ({
            ingredient: item.ingredient,
            amount: (item.amount * scaleFactor).toFixed(2),
        }));

        setScaledRecipe(scaled);
    };

    const handleReset = () => {
        setDesiredYield('');
        setIngredientAmount('');
        setScalingIngredient('');
        setScaledRecipe([]);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const date = new Date().toLocaleString();

        doc.setFontSize(16);
        doc.text('Noctua Gelato Batch Sheet', 20, 20);

        doc.setFontSize(12);
        doc.text(`Recipe: ${selectedRecipe}`, 20, 30);
        doc.text(`Input Mode: ${inputMode === 'yield' ? `Yield (${desiredYield} g)` : `${scalingIngredient} (${ingredientAmount} g)`}`, 20, 38);
        doc.text(`Generated: ${date}`, 20, 46);

        doc.setFontSize(12);
        doc.text('Ingredients:', 20, 60);

        scaledRecipe.forEach((item, idx) => {
            doc.text(`• ${item.ingredient}: ${item.amount} g`, 25, 70 + idx * 8);
        });

        doc.save(`GelatoBatch_${selectedRecipe.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <div className="container">
            <div className="logo-bar">
                <img src={logo} alt="Noctua Logo" />
            </div>
            <h1>Gelato Batch Calculator</h1>

            <div>
                <label>Choose Recipe:</label>
                <select
                    value={selectedRecipe}
                    onChange={(e) => {
                        setSelectedRecipe(e.target.value);
                        handleReset();
                    }}
                >
                    {Object.keys(recipes).map((key) => (
                        <option key={key} value={key}>
                            {key}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Input Mode:</label>
                <select
                    value={inputMode}
                    onChange={(e) => {
                        setInputMode(e.target.value);
                        handleReset();
                    }}
                >
                    <option value="yield">Scale by Yield</option>
                    <option value="ingredient">Scale by Ingredient</option>
                </select>
            </div>

            {inputMode === 'yield' ? (
                <div>
                    <label>Desired Yield (g):</label>
                    <input
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9.]*"
                        value={desiredYield}
                        onChange={(e) => setDesiredYield(e.target.value)}
                    />
                </div>
            ) : (
                <>
                    <div>
                        <label>Ingredient to Scale From:</label>
                        <select
                            value={scalingIngredient}
                            onChange={(e) => setScalingIngredient(e.target.value)}
                        >
                            <option value="">-- Select Ingredient --</option>
                            {recipes[selectedRecipe].ingredients.map((item) => (
                                <option key={item.ingredient} value={item.ingredient}>
                                    {item.ingredient}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Available Amount (g):</label>
                        <input
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9.]*"
                            value={ingredientAmount}
                            onChange={(e) => setIngredientAmount(e.target.value)}
                        />
                    </div>
                </>
            )}

            <div className="button-group">
                <button onClick={handleCalculate}>Calculate</button>
                <button onClick={handleReset}>New Batch</button>
            </div>

            {scaledRecipe.length > 0 && (
                <div className="result-card">
                    <h2>Scaled Ingredients:</h2>
                    <ul>
                        {scaledRecipe.map((item, index) => (
                            <li key={index}>
                                <strong>{item.ingredient}:</strong> {item.amount} g
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleExportPDF}>Export to PDF</button>
                </div>
            )}
        </div>
    );
}

export default App;
