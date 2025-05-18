
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { store } from './store/store';
import AppNavigator from './navigation/AppNavigator';

const App = () => {
  return (
    <Provider store={store}>
      <Toaster position="top-center" richColors />
      <AppNavigator />
    </Provider>
  );
};

export default App;
