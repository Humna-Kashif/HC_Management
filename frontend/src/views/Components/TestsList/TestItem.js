import React from "react"
import PublishIcon from '@material-ui/icons/Publish';

const TestItem = (props) => {
    const itemData = props.itemData   
    return (
        <div style={{display: "flex", flexDirection: "row", paddingTop: 5, paddingBottom: 5, alignItems: "baseline"}}>
        <div style={{display: "flex", flex: 3, flexWrap: "wrap", color: "#e0004d", fontSize: 18}}>{itemData.name}</div>
        <div style={{display: "flex", flex: 1, flexWrap: "wrap"}}>PKR:{itemData.price_in_pkr}</div>
        <div style={{display: "flex", flex: 1, flexWrap: "wrap",position:"relative",bottom:0,right:0}}> <PublishIcon style={{marginTop:15}}></PublishIcon> </div>
        <div style={{ width:100, backgroundColor: "goldenrod", color: "white", textAlign: "center", borderRadius:50, marginRight: 20, marginLeft: 20 }}> pending </div>
        <div style={{color: "#e0004d", fontWeight: "bold", padding: 6, margin: 2, cursor: "pointer"}} onClick={() => props.handleTest(itemData.name)} > x </div>
    </div>
    )
}

export default TestItem