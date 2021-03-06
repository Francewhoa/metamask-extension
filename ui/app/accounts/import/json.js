const Component = require('react').Component
const PropTypes = require('prop-types')
const h = require('react-hyperscript')
const connect = require('react-redux').connect
const actions = require('../../actions')
const FileInput = require('react-simple-file-input').default


const HELP_LINK = 'https://support.metamask.io/kb/article/7-importing-accounts'

class JsonImportSubview extends Component {
  constructor (props) {
    super(props)

    this.state = {
      file: null,
      fileContents: '',
    }
  }

  render () {
    const { error } = this.props

    return (
      h('div.new-account-import-form__json', [

        h('p', this.context.t('usedByClients')),
        h('a.warning', {
          href: HELP_LINK,
          target: '_blank',
        }, this.context.t('fileImportFail')),

        h(FileInput, {
          readAs: 'text',
          onLoad: this.onLoad.bind(this),
          style: {
            margin: '20px 0px 12px 34%',
            fontSize: '15px',
            display: 'flex',
            justifyContent: 'center',
          },
        }),

        h('input.new-account-import-form__input-password', {
          type: 'password',
          placeholder: this.context.t('enterPassword'),
          id: 'json-password-box',
          onKeyPress: this.createKeyringOnEnter.bind(this),
        }),

        h('div.new-account-create-form__buttons', {}, [

          h('button.btn-secondary.new-account-create-form__button', {
            onClick: () => this.props.goHome(),
          }, [
            this.context.t('cancel'),
          ]),

          h('button.btn-primary.new-account-create-form__button', {
            onClick: () => this.createNewKeychain(),
          }, [
            this.context.t('import'),
          ]),

        ]),

        error ? h('span.error', error) : null,
      ])
    )
  }

  onLoad (event, file) {
    this.setState({file: file, fileContents: event.target.result})
  }

  createKeyringOnEnter (event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.createNewKeychain()
    }
  }

  createNewKeychain () {
    const state = this.state

    if (!state) {
      const message = this.context.t('validFileImport')
      return this.props.displayWarning(message)
    }

    const { fileContents } = state

    if (!fileContents) {
      const message = this.context.t('needImportFile')
      return this.props.displayWarning(message)
    }

    const passwordInput = document.getElementById('json-password-box')
    const password = passwordInput.value

    if (!password) {
      const message = this.context.t('needImportPassword')
      return this.props.displayWarning(message)
    }

    this.props.importNewJsonAccount([ fileContents, password ])
  }
}

JsonImportSubview.propTypes = {
  error: PropTypes.string,
  goHome: PropTypes.func,
  displayWarning: PropTypes.func,
  importNewJsonAccount: PropTypes.func,
  t: PropTypes.func,
}

const mapStateToProps = state => {
  return {
    error: state.appState.warning,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    goHome: () => dispatch(actions.goHome()),
    displayWarning: warning => dispatch(actions.displayWarning(warning)),
    importNewJsonAccount: options => dispatch(actions.importNewAccount('JSON File', options)),
  }
}

JsonImportSubview.contextTypes = {
  t: PropTypes.func,
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(JsonImportSubview)

