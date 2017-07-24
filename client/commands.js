import React from 'react'
import { DropdownButton, MenuItem, FormGroup, FormControl } from 'react-bootstrap'

const Commands = () => (
<div id="dropdownmenu">
   <form>
      <div className = "row">
         <div className = "col-lg-offset-3 col-lg-6">
            <div className = "input-group">
               <div className = "input-group-btn">
                  <DropdownButton title="GitBot Commands">
                     <span className = "caret"></span>
                     <MenuItem><a className="dropdownLink" href = "/api/slack/searchrepos">Search GitHub Repo's</a></MenuItem>
                     <MenuItem><a className="dropdownLink" href = "/api/slack/popular">Popular Repos</a></MenuItem>
                     <MenuItem><a className="dropdownLink" href = "/api/slack/gitbranches">Active Repo Branches</a></MenuItem>
                     <MenuItem><a className="dropdownLink" href = "/api/slack/gitcommit">Last Repo Commit</a></MenuItem>
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
