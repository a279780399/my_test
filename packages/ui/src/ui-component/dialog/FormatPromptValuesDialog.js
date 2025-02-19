import { createPortal } from 'react-dom'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { JsonEditorInput } from 'ui-component/json/JsonEditor'

const FormatPromptValuesDialog = ({ show, dialogProps, onChange, onCancel }) => {
    const portalElement = document.getElementById('portal')
    const customization = useSelector((state) => state.customization)

    const component = show ? (
        <Dialog
            onClose={onCancel}
            open={show}
            fullWidth
            maxWidth='sm'
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
        >
            <DialogTitle sx={{ fontSize: '1rem' }} id='alert-dialog-title'>
                格式化提示语
            </DialogTitle>
            <DialogContent>
                <PerfectScrollbar
                    style={{
                        height: '100%',
                        maxHeight: 'calc(100vh - 220px)',
                        overflowX: 'hidden'
                    }}
                >
                    <JsonEditorInput
                        onChange={(newValue) => onChange(newValue)}
                        value={dialogProps.value}
                        isDarkMode={customization.isDarkMode}
                        inputParam={dialogProps.inputParam}
                        nodes={dialogProps.nodes}
                        edges={dialogProps.edges}
                        nodeId={dialogProps.nodeId}
                    />
                </PerfectScrollbar>
            </DialogContent>
        </Dialog>
    ) : null

    return createPortal(component, portalElement)
}

FormatPromptValuesDialog.propTypes = {
    show: PropTypes.bool,
    dialogProps: PropTypes.object,
    onChange: PropTypes.func,
    onCancel: PropTypes.func
}

export default FormatPromptValuesDialog
