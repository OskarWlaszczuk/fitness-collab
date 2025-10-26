import styled from "styled-components";

export const StyledTopPanel = styled.aside`
    display: flex;
    grid-area: search;
    border-radius: 8px;
    background-color: ${({theme}) => theme.colors.pattensBlue}
`;