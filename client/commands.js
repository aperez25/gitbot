import React from 'react'
import { DropdownButton, MenuItem, FormGroup, FormControl } from 'react-bootstrap'

const Commands = () => (
<div>
   <form>
      <div className = "row" id="dropdownmenu">
         <div className = "col-lg-6">
            <div className = "input-group">
               <div className = "input-group-btn">
                  <DropdownButton title="GitBot Commands">
                     <span className = "caret"></span>
                     <MenuItem><a href = "/api/slack/searchrepos">Search GitHub Repo's</a></MenuItem>
                     <MenuItem><a href = "/api/slack/popular">Popular Repos</a></MenuItem>
                     <MenuItem><a href = "/api/slack/gitbranches">Active Repo Branches</a></MenuItem>
                     <MenuItem><a href = "/api/slack/gitcommit">Last Repo Commit</a></MenuItem>
                  </DropdownButton>
               </div>
               <FormControl type = "text" placeholder="Enter text" />

            </div>
         </div><br />
      </div>
   </form>
</div>
)

//div style = {padding: 100px 100px 10px;}

export default Commands
