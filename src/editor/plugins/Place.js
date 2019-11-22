import React from 'react'

const bar = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}

const side = {
  display: 'flex'
}

const Place = ({
  topLeftItems,
  topRightItems,
  bottomLeftItems,
  bottomRightItems
}) => ({
  renderEditor: (props, editor, next) => {
    return (
      <>
        <div style={bar}>
          <div style={side}>
            {topLeftItems.map(
              (item, i) => (
                <div key={i}>
                  {item(editor)}
                </div>
              )
            )}
          </div>
          <div style={side}>
            {topRightItems.map(
              (item, i) => (
                <div key={i}>
                  {item(editor)}
                </div>
              )
            )}
          </div>
        </div>
        {next()}
        <div style={bar}>
          <div style={side}>
            <div style={side}>
              {bottomLeftItems.map(
                (item, i) => (
                  <div key={i}>
                    {item(editor)}
                  </div>
                )
              )}
            </div>
          </div>
          <div style={side}>
            <div style={side}>
              {bottomRightItems.map(
                (item, i) => (
                  <div key={i}>
                    {item(editor)}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
})

export default Place
