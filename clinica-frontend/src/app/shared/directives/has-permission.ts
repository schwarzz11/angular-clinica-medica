import {
  Directive,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
} from '@angular/core';
import { AuthService } from '../../core/auth'; // Use o nome do seu arquivo
import type { PerfilKey } from '../../core/models';

@Directive({
  selector: '[appHasPermission]', // Vamos usar como *appHasPermission="'chave'"
  standalone: true,
})
export class HasPermissionDirective implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);

  private permissaoNecessaria: PerfilKey | null = null;
  private hasView = false;

  // 'effect' (do Zoneless/Signals) vai rodar quando o authService.usuarioLogado() mudar
  private authEffect = effect(() => {
    this.checkPermission();
  });

  @Input()
  set appHasPermission(chave: PerfilKey) {
    this.permissaoNecessaria = chave;
    this.checkPermission();
  }

  private checkPermission(): void {
    if (!this.permissaoNecessaria) {
      this.viewContainer.clear();
      this.hasView = false;
      return;
    }

    const temPermissao = this.authService.hasPermissao(this.permissaoNecessaria);

    if (temPermissao && !this.hasView) {
      // Tem permissão e não está na tela? Adiciona.
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!temPermissao && this.hasView) {
      // Não tem permissão e está na tela? Remove.
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  ngOnDestroy(): void {
    this.authEffect.destroy(); // Limpa o 'effect'
  }
}
