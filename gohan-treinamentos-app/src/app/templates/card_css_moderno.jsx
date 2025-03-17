

import styled from 'styled-components';

const Box = styled.div`
.box {
    width: 300px;
    height: 200px;
    border: 1px solid black;
    padding: 10px;
    display: flex;


    & .title {
        font-size: 24px;
        font-weight: bold;
    }

    & .body {
        font-size: 16px;
        margin-left: 10px;
    }
}

`;


function CardBox(params) {
    return (
        <div className="box">
            <div className="title">
                Titulo: {params.title}

            </div>
            <div className="body">
                Body: {params.content}
            </div>
        </div>
    )

}

export default CardBox;