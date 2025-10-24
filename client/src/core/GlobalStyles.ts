import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    html {
        box-sizing: border-box;
    };

    *, ::after, ::before {
        box-sizing: inherit;
    };

    body {
        margin: 0;
       color: ${({ theme }) => theme.colors.black};
    };

    #root {
        font-family: "Inter", sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
    };
`;