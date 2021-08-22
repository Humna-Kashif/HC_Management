import React, { useState } from "react"
import TestItem from "./TestItem";
// import {deleteSymptomAPI} from "../../DB/API";

const TestsList = (props) => {
    // const TestsList = props.testsList;
    const [TestsList,updateList] = useState(props.testsList);
    props.parentList(TestsList);
    const handleTests = (val) => {
        console.log("tag call back val: ", val)
        props.delete(val);
        let newList = TestsList.slice(0);
        console.log("OldList:", TestsList, "Newlist: ", newList);
        newList.filter((c,i,a) => {
            if(c.name === val){
                newList.splice(i, 1);
            }
        });
        console.log("OldList:", TestsList, "Newlist: deleted ", newList);
        updateList(newList)
        
    }

    const renderTests = () => {
        console.log("Render Test ",TestsList)
       return (
        TestsList.map((item, i) => 
            <TestItem handleTest={handleTests} itemData={item} key={i} />
            )
        )
    }

    return (
        <div style={{display: "flex", flexDirection: "column", flex: 1, flexWrap: "wrap"}}>
            {renderTests()}
        </div>
    )
}

export default TestsList

TestsList.defaultProps = {
    TestsList : []
}