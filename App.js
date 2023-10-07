import Navigators from "./src/navigators";
import { Provider } from "react-redux";
import { Store } from './src/Store';
import ActiveTabContext from "./src/context/ActiveTabContext";
import { useState } from "react";

disableYellowBox = true
disableRedBox = true

const App = () => {
    const [activeTab, setActiveTab] = useState("Home");
    return (
        <ActiveTabContext.Provider value={{ activeTab, setActiveTab }}>
            <Provider store={Store}>
                <Navigators />
            </Provider>
        </ActiveTabContext.Provider>
    );
};

export default App;