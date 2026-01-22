
// CONTEXTO DE TEMA (LIGHT/DARK MODE)

import { createContext, useContext, useEffect, useState } from "react";

// CRIAR CONTEXTO

const ThemeContext = createContext();

// PROVEDOR DE TEMA

export function ThemerProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("theme");
        return saved || "light";
    });

    // Aplicar tema e salvar no localStorage
    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Alternar entre temas
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}


// HOOK PARA USAR O CONTEXTO


// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    return useContext(ThemeContext);
}