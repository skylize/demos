const defaultStyles = {
  ul: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0 2em .4em',
    listStyle: 'none',
    fontSize: '1.1em',
    margin: 'auto',
    width: '7em',
    background: 'rgb(255, 255, 220)',
  },
  li: {
    margin: '.5em 0 0',
    display: 'flex',
    justifyContent: 'center',
    listStyle: 'none',
    width: '6em',
    height: '1.4em',
    borderRadius: '.3em',
    boxShadow: 'inset -.2em -.2em .4em rgba(0, 0, 0, 0.5)',
    lineHeight: '1.42em',
  },
  btn: {
    width: '100%',
    height: '100%',
    background: 'none',
    border: 'none',
    color: 'honeydew',
    fontSize: '.8em',
    lineHeight: '.2em',
  },
}

const { li } = defaultStyles

const styles = {
  ...defaultStyles,
  dataLi: {
    ...li,
    background: 'fuchsia',
    color: 'lavender',
  },
  btnMoreLi: {
    ...li,
    background: 'mediumslateblue',
  },
  loadingLi: {
    ...li,
    boxShadow: 'none',
    color: 'slateblue',
  },
}

export { styles }
export default styles
