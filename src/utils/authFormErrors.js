export function mapValidationErrors(errors = []) {
  return errors.reduce((nextErrors, error) => {
    if (error?.field && error?.message && !nextErrors[error.field]) {
      nextErrors[error.field] = error.message;
    }

    return nextErrors;
  }, {});
}

export function getApiErrorMessage(error, fallbackMessage) {
  return error?.response?.data?.message || error?.message || fallbackMessage;
}
