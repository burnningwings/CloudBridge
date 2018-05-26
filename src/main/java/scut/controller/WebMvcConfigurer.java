package scut.controller;



import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.web.servlet.ErrorPage;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Created by Carrod on 2018/4/19.
 */

@Configuration
public class WebMvcConfigurer extends WebMvcConfigurerAdapter {

//    @Override
//    public void addInterceptors(InterceptorRegistry registry) {
//        // 拦截所有请求,通过判断是否有@LoginRequired注解,决定是否需要登录
////        registry.addInterceptor(authorityInterceptor())
////                .addPathPatterns("/**");
//        super.addInterceptors(registry);
//    }

//    @Override
//    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> argumentResolvers) {
//        System.out.println("addArgumentResolvers");
//        argumentResolvers.add(currentUserMethodArgumentResolver());
//        super.addArgumentResolvers(argumentResolvers);
//    }

//    @Override
//    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
//        System.out.println("configureMessageConverters");
//        converters.add(fastJsonHttpMessageConverterEx());
//        super.configureMessageConverters(converters);
//    }

    // 假如不想在页面渲染特定值，不用写controller，在此可直接返回静态页面
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/login").setViewName("login");
        super.addViewControllers(registry);
    }

    @Bean
    public EmbeddedServletContainerCustomizer containerCustomizer(){
        return new EmbeddedServletContainerCustomizer() {
            @Override
            public void customize(ConfigurableEmbeddedServletContainer container) {
                ErrorPage error403Page = new ErrorPage(HttpStatus.FORBIDDEN, "/403");
                container.addErrorPages(error403Page);
            }
        };
    }
//
//    @Bean
//    public AuthorityInterceptor authorityInterceptor() {
//        return new AuthorityInterceptor();
//    }
}
