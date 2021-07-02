import { useEffect } from "react";

const MessagesPart = (props) => {

    const {msg,uid} =props.message;

    return ( 
        <div>

            <div>
                hello
                {msg}
            </div>
        </div>
     );
}
 
export default MessagesPart;