import React, { use } from 'react'
import SideNav from '../_components/SideNav'

function Workspace({params}) {
  const resolvedParams = use(params);

  return (
    <div>
        <div>
            <SideNav params={resolvedParams} />
        </div>
    </div>
  )
}

export default Workspace