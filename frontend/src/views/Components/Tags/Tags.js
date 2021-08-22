import React, { useState } from "react"
import TagItem from "./TagItem";
// import {deleteSymptomAPI} from "../../DB/API";

const Tags = (props) => {
    const [TagsList, updateList] = useState(props.tagsList);
    // console.log("tags are ", TagsList);
    const handleTag = (val) => {
        console.log("tag call back val: ", val)
        props.delete(val);
        let newList = TagsList.slice(0);
        console.log("OldList:", TagsList, "Newlist: ", newList);
        newList.filter((c,i,a) => {
            if(c.name === val){
                newList.splice(i, 1);
            }
        });
        console.log("OldList:", TagsList, "Newlist: ", newList);
        // updateList(newList)
        props.parentList(newList)
    }

    const renderTags = () => {
        return (
        TagsList.map((item, i) => 
            <TagItem handleTag={handleTag} itemData={item} key={i} />
            )
        )
    }

    return (
        <div style={{display: "flex", flexDirection: "row", flex: 1, flexWrap: "wrap"}}>
            {renderTags()}
        </div>
    )
}

export default Tags

Tags.defaultProps = {
    tagsList : []
}