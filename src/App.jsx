import { useState } from 'react';
import './App.css';
import logo from './images/Noctua_Primary-Logo_Almond.png';

// Recipe data
const recipes = {
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
};
function App() {
    const [selectedRecipe, setSelectedRecipe] = useState('Milk Base');
    const [desiredYield, setDesiredYield] = useState('');
    const [scaledRecipe, setScaledRecipe] = useState([]);

    const handleCalculate = () => {
        const { ingredients, baseYield } = recipes[selectedRecipe];
        const scaleFactor = parseFloat(desiredYield) / baseYield;

        const scaled = ingredients.map(item => ({
            ingredient: item.ingredient,
            amount: (item.amount * scaleFactor).toFixed(2),
        }));

        setScaledRecipe(scaled);
    };

    return (
        <div className="container">
            <div className="logo-bar">
                <img src={logo} alt="Noctua Logo"/>
            </div>
            <h1>Gelato Batch Calculator</h1>

            <div>
                <label>Choose Recipe:</label>
                <select
                    value={selectedRecipe}
                    onChange={(e) => setSelectedRecipe(e.target.value)}
                >
                    {Object.keys(recipes).map((key) => (
                        <option key={key} value={key}>
                            {key}
                        </option>
                    ))}
                </select>
            </div>

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

            <div className="button-group">
                <button onClick={handleCalculate}>Calculate</button>
                <button onClick={() => {
                    setDesiredYield('');
                    setScaledRecipe([]);
                }}>New Batch
                </button>
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
                </div>
            )}
        </div>
    );
}

export default App;
