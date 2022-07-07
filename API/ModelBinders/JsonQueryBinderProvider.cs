using Core.Specifications;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace API.ModelBinders
{
    public class JsonQueryBinderProvider : IModelBinderProvider
    {
        public IModelBinder GetBinder(ModelBinderProviderContext context)
        {
            return
                context.Metadata.ModelType == typeof(AdminListQueryParams) ||
                context.Metadata.ModelType == typeof(AdminManyQueryParams)
                    ? new JsonQueryBinder()
                    : null;
        }
    }
}