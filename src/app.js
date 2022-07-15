import "@passageidentity/passage-elements/passage-auth"

function App() {
    return (
        <div>
            <passage-auth app-id={process.env.REACT_APP_PASSAGE_APP_ID}></passage-auth>
        </div>
    )
}

export default App;
