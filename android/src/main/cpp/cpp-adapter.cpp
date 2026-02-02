#include <jni.h>
#include "M3OnLoad.hpp"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*) {
  return margelo::nitro::m3::initialize(vm);
}
