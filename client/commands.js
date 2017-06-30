import React from 'react'

const Commands = () => (
<div>
   <form className = "bs-example bs-example-form" role = "form">
      <div className = "row">
         <div className = "col-lg-6">
            <div className = "input-group">
               <div className = "input-group-btn">
                  <button type = "button" className = "btn btn-default dropdown-toggle"
                     data-toggle = "dropdown" role="menuitem">
                     Commands
                     <span className = "caret"></span>
                  </button>
                  <ul className = "dropdown-menu">
                     <li><a href = "#">Search GitHub Repos</a></li>
                     <li><a href = "#">Most popular repos in past week</a></li>
                     <li><a href = "#">View your GitHub repo's branches</a></li>
                     <li className = "divider"></li>
                     <li><a href = "#">Get your repo's last commit</a></li>
                  </ul>
               </div>
               <input type = "text" className = "form-control" />
            </div>
         </div><br />
      </div>
   </form>
</div>

)
//div style = {padding: 100px 100px 10px;}

export default Commands
