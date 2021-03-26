import React from 'react';
import { login, logout } from './utils';
import getConfig from './config';

const { networkId } = getConfig(process.env.NODE_ENV || 'development');

export class App2 extends React.Component {
  state = {
    messages: [],
    message: '',
    recipient: '',
    sending: false,
    loading: true,
    deleting: false,
  };

  async componentDidMount() {
    if (window.walletConnection.isSignedIn()) {
      const messages = await window.contract.getMessages({ accountId: window.accountId });
      this.setState({ messages, loading: false });
    }
  }

  async deleteMessage(id) {
    this.setState({ deleting: true });
    await window.contract.deleteMessage({ accountIdTo: window.accountId, id });
    const messages = await window.contract.getMessages({ accountId: window.accountId });
    this.setState({ messages, deleting: false });
  }

  async deleteAllMessages() {
    this.setState({ deleting: true });
    await window.contract.deleteAllMessages({ accountIdTo: window.accountId });
    const messages = await window.contract.getMessages({ accountId: window.accountId });
    this.setState({ messages, deleting: false });
  }

  async sendMessage() {
    const { message, recipient } = this.state;
    this.setState({ sending: true });
    await window.contract.sendMessage({ accountIdTo: recipient.trim(), text: message });
    const messages = await window.contract.getMessages({ accountId: window.accountId });
    this.setState({
      message: '',
      messages,
      sending: false,
    });
  }

  render() {
    const s = this.state;

    if (!window.walletConnection.isSignedIn()) {
      return (
        <div>
          <button onClick={() => login()}>Sign in</button>
        </div>
      );
    } else {
      return (
        <div>
          <div className="n-header">
            <div className="flex-grow-6">
              <h1>NEAR Mail</h1>
            </div>
            <div className="flex flex-grow-1 j-cont-fl-end">
              You're logged in as {window.accountId}
            </div>
            <div className="flex flex-grow-1 j-cont-fl-end">
              <button onClick={() => logout()}>Sign out</button>
            </div>
          </div>
          <main>
            <h2>Send Message</h2>
            <div>
              Recipient:{' '}
              <input
                type="text"
                value={s.recipient}
                onChange={(e) => this.setState({ recipient: e.target.value })}
              />
            </div>
            <div>
              Message:{' '}
              <input
                type="text"
                value={s.message}
                onChange={(e) => this.setState({ message: e.target.value })}
              />
            </div>
            <div>
              <button disabled={s.sending} onClick={() => this.sendMessage()}>
                Send
              </button>
            </div>
            {!s.loading ?
              (
                <div>
                  <h2>Incoming Messages</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Sender</th>
                        <th>Reciever</th>
                        <th>Message</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.messages.map((x, i) => (
                        <tr key={i}>
                          <td>{i}</td>
                          <td>{(new Date((+x.blockTimestamp) / 1000000)).toLocaleString()}</td>
                          <td>{x.accountIdFrom}</td>
                          <td>{x.accountIdTo}</td>
                          <td>{x.text}</td>
                          <td>
                            <button disabled={s.deleting} onClick={() => this.deleteMessage(i)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div>
                    <button disabled={s.disabled} onClick={() => this.deleteAllMessages()}>
                      Delete All
                    </button>
                  </div>
                </div>
              ) : (
                <div>Loading...</div>
              )
            }
          </main>
        </div>
      );
    }
  }
}
