import "./main.css";
import Header from "./components/layout/Header";
import Navigation from "./components/layout/Navigation";
import { NavigationProvider, useNavigationContext } from "./store/navigation";

function AppContent() {
	const { page, inputBuffer, handleInput, confirmPage, navigateToPage, renderedPage } = useNavigationContext();

	return (
		<main 
			className="flex flex-col max-w-screen-lg mx-auto overflow-hidden"
			style={{ height: '100dvh' }}
		>
			<Header
				pageNumber={page}
				inputBuffer={inputBuffer}
				onInputChange={handleInput}
				onConfirm={confirmPage}
			/>
			<div className="flex-1 max-w-screen-lg mx-3">
				{renderedPage}
			</div>
			<Navigation onNavigate={navigateToPage} />
		</main>
	);
}

function App() {
	return (
		<NavigationProvider>
			<AppContent />
		</NavigationProvider>
	);
}

export default App;
