import Navigators from "./src/navigators";
import { Provider } from "react-redux";
import { Store } from './src/Store';


const App = () => {
    return (
        <Provider store={Store}>
            <Navigators />
        </Provider>
    );
};

export default App;