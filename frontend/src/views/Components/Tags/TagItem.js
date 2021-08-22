import React from "react"

const TagItem = (props) => {
    const itemData = props.itemData
    
    return (
    <div 
        style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center", 
            backgroundColor: "#e0004d", 
            color: "white", 
            minWidth: 30, 
            borderRadius: 20, 
            paddingLeft: 8, 
            paddingRight: 8, 
            margin: 2}}>
        <div>{itemData.name}</div>
        <div 
            onClick={() => props.handleTag(itemData.name)} 
            style={{ fontWeight: "bold", marginLeft: 4, paddingLeft: 4, paddingRight: 4, fontSize: 12, cursor: "pointer"}}>
                x
        </div>
    </div>
    )
}

export default TagItem