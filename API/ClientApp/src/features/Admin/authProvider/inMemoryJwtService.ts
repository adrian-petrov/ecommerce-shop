import { AxiosResponse } from 'axios';
import { TAuthenticateResponse } from '../../Account/types';
import { adminInstance } from '../api';

class InMemoryJwtService {
  private _token: string | null = null;

  private _refreshTokenRequest: Promise<
    AxiosResponse<TAuthenticateResponse>
  > | null = null;

  constructor() {
    this.resetToken = this.resetToken.bind(this);
    this.getRefreshToken = this.getRefreshToken.bind(this);
    this.resetRefreshTokenRequest = this.resetRefreshTokenRequest.bind(this);
    this.revokeToken = this.revokeToken.bind(this);
  }

  public get token(): string | null {
    return this._token;
  }

  public set token(value: string | null) {
    this._token = value;
  }

  public getRefreshToken() {
    if (!this._refreshTokenRequest) {
      this._refreshTokenRequest = adminInstance.post<TAuthenticateResponse>(
        'account/refresh-token',
      );

      this._refreshTokenRequest.then(
        this.resetRefreshTokenRequest,
        this.resetRefreshTokenRequest,
      );
    }
    return this._refreshTokenRequest;
  }

  public revokeToken() {
    this.resetToken();
    return adminInstance.post('account/revoke-token');
  }

  public resetToken(): void {
    this._token = null;
  }

  private resetRefreshTokenRequest(): void {
    this._refreshTokenRequest = null;
  }
}

export default new InMemoryJwtService();
