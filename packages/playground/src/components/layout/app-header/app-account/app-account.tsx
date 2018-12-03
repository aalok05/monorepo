import { Component, Prop } from "@stencil/core";

@Component({
  tag: "app-account",
  styleUrl: "app-account.scss",
  shadow: true
})
export class AppAccount {
  @Prop() authenticated: boolean = false;

  render() {
    return this.authenticated ? (
      <div class="info-container">
        <app-account-info
          src="/assets/icon/cf.png"
          header="Balance"
          content="0.1000 ETH"
        />
        <app-account-info
          src="/assets/icon/account.png"
          header="Account"
          content="username"
        />
      </div>
    ) : (
      <div class="btn-container">
        <button class="btn">Login</button>
        <button class="btn btn-outline">Register</button>
      </div>
    );
  }
}
