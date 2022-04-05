import React from 'react';
import Router from 'next/router'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        window.localStorage.clear()
        localStorage.clear()
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-page-container">
                    <div className="error-page-container_section">
                        <h3>Sorry something went wrong, our developers are working hard to fix it as fast as it possible </h3>
                        <p>
                            <span onClick={() => {
                                this.setState({ hasError: false })
                                Router.push('/')
                            }}>
                                Go to Home page
                            </span>
                        </p>
                    </div>
                </div>
            )
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
